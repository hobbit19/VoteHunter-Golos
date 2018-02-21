<?php
/**
 * Created by PhpStorm.
 * User: user
 * Date: 2/17/18
 * Time: 2:32 PM
 */

namespace app\controllers;


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
        //$strGolosPermLink = strtolower(str_replace([' ', '?', '!', ], '-',Transliterator::encode(\Yii::$app->request->post('title'), Transliterator::LANG_RU)));
        $objPost = Posts::findOne(['golos_permlink' => $strGolosPermLink, 'user_id' => \Yii::$app->user->getId()]);
        if(!is_object($objPost)) {
            $objPost = new Posts();
        }
        //$objPost->title = \Yii::$app->request->post('title');
        //$objPost->description =  \Yii::$app->request->post('description');
        //$objPost->encoded = \Yii::$app->request->post('encoded');
        $objPost->price =  \Yii::$app->request->post('price');
        //$objPost->video_url =  $strEncryptedData;
        $objPost->not_encrypted = 0;//\Yii::$app->request->post('not_encrypted');
        $objPost->secret_key = $strKey;
        $objPost->user_id = \Yii::$app->user->getId();
        $objPost->golos_permlink = $strGolosPermLink;
        $objPost->golos_parentPermlink = 'votehunter';
        if($objPost->save()) {
            $strLink = "http://votehunter.io/post?a=".\Yii::$app->user->getIdentity()->golos_nick."&p=".$objPost->golos_permlink;
            $strBody = \Yii::$app->request->post('body','') .
                "<br> !! Для просмотра зашифрованного контента нужно оплатить  ".$objPost->price.
                " GOLOS автору: <a href='$strLink'>перейдите на VoteHunter</a>";
            return [
                'status' => 'ok',
                'data' => [
                    'title' => \Yii::$app->request->post('title',''),
                    'body' => $strBody,
                    'parentPermlink' => $objPost->golos_parentPermlink,
                    'author' => \Yii::$app->user->getIdentity()->golos_nick,
                    'permlink' => $objPost->golos_permlink,
                    'jsonMetadata' => [
                        'tags' => [],
                        'encodedData' => $strEncryptedData
                    ],
                    'post_link' => str_replace('http://votehunter.io','',$strLink)
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
                'msg' => 'Post not found 1'
            ];
        }
        $objPost = Posts::findOne(['user_id' => $author->id, 'golos_permlink' => \Yii::$app->request->post('permlink')]);
        if(!is_object($objPost)) {
            return [
                'status' => 'error',
                'msg' => 'Post not found 2'
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
        $strPostPermlink = $objPost->golos_permlink;

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
                'permlink' => $objPost->golos_permlink,
                'answer' => $answer,
            ];
        }catch (Exception $e){
            return [
                'status' => 'error',
                'msg' => $e->getMessage()
            ];
        }
    }
}