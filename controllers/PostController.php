<?php
/**
 * Created by PhpStorm.
 * User: user
 * Date: 2/17/18
 * Time: 2:32 PM
 */

namespace app\controllers;


use app\api\golos\GolosApi;
use app\api\GrapheneNodeClient\OpTransfer;
use app\api\steem\SteemApi;
use app\helpers\ImageHelper;
use app\helpers\IPFSHelper;
use app\models\Anubis;
use app\models\HashUrl;
use app\models\PaidPosts;
use app\models\Patron;
use app\models\Posts;
use app\models\Profile;
use app\models\Rewards;
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
use yii\web\UploadedFile;
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
        print_r(\Yii::$app->request->post());
        exit();
        if(\Yii::$app->user->isGuest) {
            return [
                'status' => 'Need login'
            ];
        }
        $strVideoUrl = \Yii::$app->request->post('video_url');
        $mixIPFS = null;
        if(!empty($_FILES['video_file'])) {
            if(!empty($_FILES['screen_file']) || \Yii::$app->request->post('base64') !== null) {
                $mixIPFS = IPFSHelper::uploadFile('screen_file', ['base64' => \Yii::$app->request->post('base64')]);
                if (empty($mixIPFS)) {
                    return [
                        'status' => 'error',
                        'msg' => \Yii::t('app', 'Cannot upload thumbnail to IPFS.'),
                    ];
                }
                if (!empty(\Yii::$app->params['isDevelopment'])) {
                    $strThumbUrl = 'https://usource.ru/ipfs/' . $mixIPFS['Hash'];
                } else {
                    $strThumbUrl = 'https://usource.ru/ipfs/' . $mixIPFS['Hash'];
                }
            } else {
                return [
                    'status' => 'error',
                    'msg' => \Yii::t('app', 'Please select thumbnail image for you video.'),
                ];
            }
            $mixIPFS = IPFSHelper::uploadFile('video_file');
        }
        if(!empty($mixIPFS)) {
            if(!empty(\Yii::$app->params['isDevelopment'])) {
                $strVideoUrl = 'http://localhost:8080/ipfs/' .  $mixIPFS['Hash'];
            } else {
                $strVideoUrl = 'https://usource.ru/ipfs/' .  $mixIPFS['Hash'];
            }
        } else {
            //youtube link
            $strThumbUrl = ImageHelper::getYouTubeImg($strVideoUrl);
            if($strThumbUrl == '') {
                return [
                    'status' => 'error',
                    'msg' => \Yii::t('app', 'Wrong youtube video url'),
                ];
            }
        }
        $strKey = str_replace(['_', '/', '-'], '', \Yii::$app->security->generateRandomString());
        $objAnubis = new Anubis();
        $objAnubis->setKey($strKey);
        $strEncryptedData = base64_encode($objAnubis->encrypt($strVideoUrl));
        $objAnubis->setKey(\Yii::$app->request->post('pKey'));
        $strEncKey = base64_encode($objAnubis->encrypt($strKey));
        if(!empty(\Yii::$app->request->post('updatePost'))) {
            $strPermLink = \Yii::$app->request->post('permlink');
            $objPost = Posts::findOne(['permlink' => $strPermLink, 'user_id' => \Yii::$app->user->getId()]);
        } else {
            $objHashUrl = HashUrl::findOne(['used' => 0]);
            $strPermLink = $objHashUrl->hash;
            $objHashUrl->used = 1;
            $objHashUrl->save();
            $objPost = Posts::findOne(['permlink' => $strPermLink, 'user_id' => \Yii::$app->user->getId()]);
        }
        if(!is_object($objPost)) {
            $objPost = new Posts();
        }
        $objPost->price =  \Yii::$app->request->post('price');
        $objPost->not_encrypted = 0;//\Yii::$app->request->post('not_encrypted');
        $objPost->secret_key = $strKey;
        $objPost->user_id = \Yii::$app->user->getId();
        $objPost->permlink = $strPermLink;
        $objPost->parentPermlink = 'usource';
        $objPost->title = \Yii::$app->request->post('title');
        $objPost->body = \Yii::$app->request->post('body');
        $objPost->cat_id = \Yii::$app->request->post('cat_id');
        $objPost->patrons_only = \Yii::$app->request->post('patrons_only');
        $objPost->thumbnail = $strThumbUrl;

        //post tags
        $arrTags = \Yii::$app->request->post('tags',[]);
        if(!is_array($arrTags)) {
            $arrTags = [];
        }
        if(count($arrTags) > 4) {
            $arrTags = array_slice($arrTags, 0, 4);
        }
        array_unshift($arrTags, 'usource');
        //---------

        if($objPost->save()) {
            $objProfile = Profile::findOne(['user_id' => \Yii::$app->user->getId()]);
            $strLink = "https://usource.ru/p/".$objProfile->url."/".$objPost->permlink;
            $strBody = \Yii::$app->request->post('body','') .
                "<br><a href='$strLink'><img src='$strThumbUrl'></a>";
            return [
                'status' => 'ok',
                'data' => [
                    'title' => \Yii::$app->request->post('title',''),
                    'body' => $strBody,
                    'parentPermlink' => $objPost->parentPermlink,
                    'author' => \Yii::$app->user->getIdentity()->golos_nick,
                    'permlink' => $objPost->permlink,
                    'jsonMetadata' => [
                        'tags' => $arrTags,
                        'app' => 'usource.ru',
                        'encodedData' => $strEncryptedData,
                        'encKey' => $strEncKey,
                        'thumbnail' => $strThumbUrl,
                    ],
                    'post_link' => str_replace('https://usource.ru','',$strLink)
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
        $arrMetaData = json_decode(\Yii::$app->request->post('metadata'), true);
        $strEncryptedData = $arrMetaData['encodedData'];
        //$strBody = mb_substr($strBody, 0, mb_strpos($strBody, '<br> !!') -1);
        $objAnubis = new Anubis();
        $objAnubis->setKey($objPost->secret_key);
        $strVideoUrl = $objAnubis->decrypt(base64_decode($strEncryptedData));
        $boolShowVideoLink = $objPost->patrons_only == 0;
        $objPaid = PaidPosts::findOne(['user_id' => \Yii::$app->user->getId(), 'post_id' => $objPost->id]);
        if(is_object($objPaid)) {
            $boolShowVideoLink = true;
        }
        if(\Yii::$app->user->getId() === $objPost->user_id) {
            $boolShowVideoLink = true;
        }
        $arrPost = [
            'id' => $objPost->id,
            'post_image' => (!empty($arrMetaData['thumbnail']) ? $arrMetaData['thumbnail'] : '/images/default-video.jpg'),
            'body' => $objPost->body,
            'patrons_only' => $objPost->patrons_only,
            ''
            //'body' => $strBody,
        ];
        if($boolShowVideoLink) {
            $arrPost['video_url'] = $strVideoUrl;
        }

        //ipfs or not?
        if(ImageHelper::getYouTubeImg($arrPost['video_url']) == '') {
            //ipfs link
            $arrPost['video_ipfs'] = $arrPost['video_url'];
            unset($arrPost['video_url']);
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
        $objApi = new SteemApi();
        $arrBCPosts= $objApi->getDiscussionsByBlog($objUser->golos_nick, 'usource');
        $arrPosts = [];
        $arrTags = [];
        foreach ($arrObjPosts as $objPost) {
            /* @var $objPost \app\models\Posts */
            $strVideoUrl = null;
            $strPostImage = null;
            $isLocked = true;
            if(isset($arrBCPosts[$objPost->permlink])) {
                $boolNeedToSave = false;
/*                if ($objPost->body != $arrBCPosts[$objPost->permlink]['body']) {
                    $objPost->body = $arrBCPosts[$objPost->permlink]['body'];
                    $boolNeedToSave = true;
                }*/
                if ($objPost->title != $arrBCPosts[$objPost->permlink]['title']) {
                    $objPost->title = $arrBCPosts[$objPost->permlink]['title'];
                    $boolNeedToSave = true;
                }
                if ($boolNeedToSave) {
                    $objPost->save();
                    $objPost->refresh();
                }
                $arrMetaData = json_decode($arrBCPosts[$objPost->permlink]['json_metadata'], true);
                $arrTags = $arrMetaData['tags'];
                array_shift($arrTags);
                if (!empty($arrMetaData['encodedData'])) {
                    $strVideoUrl = $objPost->decryptData($arrMetaData['encodedData']);
                    $strPostImage = (!empty($arrMetaData['thumbnail']) ? $arrMetaData['thumbnail'] : '/images/default-video.jpg');
                }
                $intCurrentUser = \Yii::$app->user->isGuest ? 0 : \Yii::$app->user->getId();
                $objPatron = Patron::findOne(['user_id' => $objPost->user_id, 'patron_id' => $intCurrentUser, 'status' => Patron::STATUS_ACTIVE]);
                if(is_object($objPatron) && $objPatron->patron_sum >= $objPost->patrons_only || $objPost->user_id == $intCurrentUser || $objPost->patrons_only == 0) {
                    $isLocked = false;
                } else {
                    $strVideoUrl = null;
                    $strPostImage = null;
                }
            }
            $arrPost = $objPost->toArray(['title', 'body', 'user_id','permlink']) + ['video_url' => str_replace('watch?v=','embed/', $strVideoUrl), 'post_image' => $strPostImage];
            $arrPost += [
                'link' => '/p/' . $objUser->profile->url . '/' . $objPost->permlink,
                'profile_image' => $objUser->profile->profile_image,
                'price_usd' => $objPost->patrons_only > 0 ? $objPost->patrons_only : \Yii::t('app', 'Public'),
                'profile_name' =>  $objUser->profile->name,
                'isLocked' => $isLocked,
                'author' => $objUser->golos_nick,
                'tags' => $arrTags,
            ];
            $arrPost += [
                'youtube' => (strpos($strVideoUrl, '/ipfs/') === false)
            ];
            $arrPosts[] = $arrPost;
        }
        return [
            'status' => 'ok',
            'posts' => $arrPosts
        ];
    }

    public function actionPrivacyList()
    {
        if(\Yii::$app->user->isGuest) {
            return [
                'status' => 'error',
                'msg' => \Yii::t('app', 'You are not logged in')
            ];
        }
        $arrPrivacy = [
            [ 'str' => 'Public', 'value' => 0 ],
            [ 'str' => 'Supporters only', 'value' => 1 ],
        ];
        $arrRewards = Rewards::find()->where(['user_id' => \Yii::$app->user->getId()])->asArray()->all();
        foreach ($arrRewards as $arrReward) {
            $arrPrivacy[] = [ 'str' => 'Supporters $' . $arrReward['amount'] . '+', 'value' => $arrReward['amount']];
        }
        return [
            'status' => 'ok',
            'privacy' => $arrPrivacy,
        ];
    }

    public function actionIsExists()
    {
        $objProfile = Profile::findOne(['url' => \Yii::$app->request->get('url')]);
        if(is_object($objProfile)) {
            $objPost = Posts::findOne(['permlink' => \Yii::$app->request->get('permlink')]);
            if(is_object($objPost)) {
                return [
                    'status' => 'ok',
                    'nick' => $objProfile->user->golos_nick,
                    'url' => $objProfile->url,
                ];
            }
        }
        return [
            'status' => 'error'
        ];

    }

}