<?php
/**
 * Created by PhpStorm.
 * User: user
 * Date: 2/17/18
 * Time: 2:32 PM
 */

namespace app\controllers;


use app\api\golos\GolosApi;
use app\helpers\ImageHelper;
use app\models\Anubis;
use app\models\PaidPosts;
use app\models\Posts;
use GrapheneNodeClient\Tools\ChainOperations\OpTransfer;
use app\models\Users;

use GrapheneNodeClient\Tools\Transliterator;
use yii\web\Controller;

use GrapheneNodeClient\Commands\CommandQueryData;
use GrapheneNodeClient\Commands\DataBase\GetDiscussionsByCreatedCommand;
use GrapheneNodeClient\Commands\Login\LoginCommand;
use GrapheneNodeClient\Connectors\WebSocket\GolosWSConnector;
use GrapheneNodeClient\Connectors\WebSocket\SteemitWSConnector;
use GrapheneNodeClient\Tools\Transaction;
use GrapheneNodeClient\Connectors\Http\SteemitHttpConnector;
use GrapheneNodeClient\Commands\Broadcast\BroadcastTransactionSynchronousCommand;
use GrapheneNodeClient\Tools\ChainOperations\OpVote;
use Zend\Debug\Debug;

class PostController extends Controller
{
    public function beforeAction($action)
    {
        \Yii::$app->request->enableCsrfValidation = false;
        $this->enableCsrfValidation = false;
        \Yii::$app->response->format = 'json';
        return parent::beforeAction($action);
    }

    public function actionAdd()
    {
        if(\Yii::$app->user->isGuest) {
            return [
                'status' => 'Need login'
            ];
        }

        $strKey = str_replace(['_', '/', '-'], '', \Yii::$app->security->generateRandomString());
        $objAnubis = new Anubis();
        $objAnubis->setKey($strKey);
        $strEncryptedData = base64_encode($objAnubis->encrypt(\Yii::$app->request->post('video_url')));
        $strGolosPermLink = strtolower(preg_replace("/[^a-zA-Z0-9]/", '-',Transliterator::encode(\Yii::$app->request->post('title'), Transliterator::LANG_RU)));
        $objPost = Posts::findOne(['permlink' => $strGolosPermLink, 'user_id' => \Yii::$app->user->getId()]);
        if(!is_object($objPost)) {
            $objPost = new Posts();
        }
        $objPost->price =  \Yii::$app->request->post('price');
        $objPost->not_encrypted = 0;//\Yii::$app->request->post('not_encrypted');
        $objPost->secret_key = $strKey;
        $objPost->user_id = \Yii::$app->user->getId();
        $objPost->permlink = $strGolosPermLink;
        $objPost->parentPermlink = 'yousource';
        $objPost->title = \Yii::$app->request->post('title');
        $objPost->body = \Yii::$app->request->post('body');
        $objPost->cat_id = \Yii::$app->request->post('cat_id');
        $objPost->patron_only = \Yii::$app->request->post('patron_only');
        if($objPost->save()) {
            $strLink = "http://yousource.io/post?a=".\Yii::$app->user->getIdentity()->golos_nick."&p=".$objPost->permlink;
            $strBody = \Yii::$app->request->post('body','') .
                "<br> !! Для просмотра зашифрованного контента нужно оплатить  ".$objPost->price.
                " GOLOS автору: <a href='$strLink'>перейдите на YouSource</a>";
            return [
                'status' => 'ok',
                'data' => [
                    'title' => \Yii::$app->request->post('title',''),
                    'body' => $strBody,
                    'parentPermlink' => $objPost->parentPermlink,
                    'author' => \Yii::$app->user->getIdentity()->golos_nick,
                    'permlink' => $objPost->permlink,
                    'jsonMetadata' => [
                        'tags' => ['yousource'],
                        'encodedData' => $strEncryptedData
                    ],
                    'post_link' => str_replace('http://yousource.io','',$strLink)
                ]
            ];
        }
    }

    public function actionShow()
    {
        $author = Users::findOne(['golos_nick' => \Yii::$app->request->post('author')]);
        if(!is_object($author)) {
            return [
                'status' => 'error',
                'msg' => 'Post not found'
            ];
        }
        $objPost = Posts::findOne(['user_id' => $author->id, 'permlink' => \Yii::$app->request->post('permlink')]);
        if(!is_object($objPost)) {
            return [
                'status' => 'error',
                'msg' => 'Post not found'
            ];
        }

        $strBody = \Yii::$app->request->post('body');
        $arrMeta = json_decode(\Yii::$app->request->post('metadata'), true);
        $strEncryptedData = $arrMeta['encodedData'];
        $strBody = mb_substr($strBody, 0, mb_strpos($strBody, '<br> !!') -1);
        $objAnubis = new Anubis();
        $objAnubis->setKey($objPost->secret_key);
        $strVideoUrl = $objAnubis->decrypt(base64_decode($strEncryptedData));
        $boolShowVideoLink = false;
        $objPaid = PaidPosts::findOne(['user_id' => \Yii::$app->user->getId(), 'post_id' => $objPost->id]);
        if(is_object($objPaid)) {
            $boolShowVideoLink = true;
        }
        if(\Yii::$app->user->getId() === $objPost->user_id) {
            $boolShowVideoLink = true;
        }
        $arrPost = [
            'id' => $objPost->id,
            'body' => $strBody,
        ];
        if($boolShowVideoLink) {
            $arrPost['video_url'] = $strVideoUrl;
        }

        return [
            'status' => 'ok',
            'post' => $arrPost,
            ];
    }

    public function actionTest()
    {
        $objPost = Posts::findOne(76);
        var_dump($objPost->author->golos_nick);
    }

    public function actionPay()
    {
        $intPostId = (int)\Yii::$app->request->post('post_id');
        $strWifFrom = \Yii::$app->request->post('active_wif');
        $objPost = Posts::findOne($intPostId);

        $fltPercent = 0.1;
        $strUserFrom = \Yii::$app->user->getIdentity()->golos_nick;
        $strUserFee = 'deskle';
//        $strWifFrom = '5HpZZ2E9BfBNNJAimKHEdwD9zd6AGUFVzixV4P64GWGswKWfqsj';
        $strUserTo = $objPost->author->golos_nick;
        $fltSum = $objPost->price;
        $strPostPermlink = $objPost->permlink;

//        Debug::dump($fltSum * (1 - $fltPercent) . ' GOLOS');
//        exit();

        $connector = new GolosWSConnector();
        try{
            $answer = OpTransfer::doSynchronous(
                $connector,
                $strWifFrom,
                $strUserFrom,
                $strUserTo,
                sprintf('%01.3f GOLOS', $fltSum * (1 - $fltPercent)),
                $strPostPermlink
            );

            OpTransfer::doSynchronous(
                $connector,
                $strWifFrom,
                $strUserFrom,
                $strUserFee,
                sprintf('%01.3f GOLOS', $fltSum * $fltPercent),
                'Fee from: ' . $strUserTo . '/' . $strPostPermlink
            );

            $objPaidPost = new PaidPosts();
            $objPaidPost->user_id = \Yii::$app->user->getId();
            $objPaidPost->post_id = $intPostId;
            $objPaidPost->save();

            return [
                'status' => 'ok',
                'author' => $objPost->author->golos_nick,
                'permlink' => $objPost->permlink,
                'answer' => $answer,
            ];
        }catch (Exception $e){
            return [
                'status' => 'error',
                'msg' => $e->getMessage()
            ];
        }
    }

    public function actionList()
    {
        $intUserId = \Yii::$app->request->get('user_id', (\Yii::$app->user->isGuest ? '0' : \Yii::$app->user->getId()));
        if ($intUserId == 0) {
            return [
                'status' => 'ok',
                'posts' => [],
            ];

        }
        $objUser = Users::findOne($intUserId);
        $arrObjPosts = Posts::find()->where(['user_id' => $intUserId])->orderBy('')->all();

        //get post from blockchain
        $objApi = new GolosApi();
        $arrBCPosts= $objApi->getDiscussionsByBlog($objUser->golos_nick, 'yousource');
        foreach ($arrObjPosts as $objPost) {
            /* @var $objPost \app\models\Posts */
            $strVideoUrl = null;
            $strPostImage = null;
            if(isset($arrBCPosts[$objPost->permlink])) {
                $boolNeedToSave = false;
                if ($objPost->body != $arrBCPosts[$objPost->permlink]['body']) {
                    $objPost->body = $arrBCPosts[$objPost->permlink]['body'];
                    $boolNeedToSave = true;
                }
                if ($objPost->title != $arrBCPosts[$objPost->permlink]['title']) {
                    $objPost->title = $arrBCPosts[$objPost->permlink]['title'];
                    $boolNeedToSave = true;
                }
                if ($boolNeedToSave) {
                    $objPost->save();
                    $objPost->refresh();
                }
                $arrMetaData = json_decode($arrBCPosts[$objPost->permlink]['json_metadata'], true);
                if (!empty($arrMetaData['encodedData'])) {
                    $strVideoUrl = $objPost->decryptData($arrMetaData['encodedData']);
                    $strPostImage = ImageHelper::getYouTubeImg($strVideoUrl);
                }
            }
            $arrPost = $objPost->toArray(['title', 'body']) + ['video_url' => $strVideoUrl, 'post_image' => $strPostImage];

            $arrPosts[] = $arrPost;
        }
        return [
            'status' => 'ok',
            'posts' => $arrPosts
        ];
    }

}