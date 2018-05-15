<?php
/**
 * Created by PhpStorm.
 * User: user
 * Date: 2/17/18
 * Time: 6:17 PM
 */

namespace app\controllers;


use app\models\Profile;
use app\models\User;
use app\models\Users;
use yii\web\Controller;

class UserController extends Controller
{
    public function actionMe()
    {
        if(\Yii::$app->user->isGuest) {
            return [
                'status' => 'error'
            ];
        }

        $objUser = \Yii::$app->user->getIdentity();
        /* @var $objUser \app\models\Users */
        return [
            'status' => 'ok',
            'user_id' => \Yii::$app->user->getId(),
            'golos_nick' => $objUser->golos_nick,
            'profile_image' => !empty($objUser->profile->profile_image) ? $objUser->profile->profile_image : Profile::DEFAULT_AVATAR,
            'profile_url' => !empty($objUser->profile->url) ? $objUser->profile->url : $objUser->golos_nick,
            'community_permlink' => empty($objUser->community_permlink) ? $objUser->makeCommunityPermLink() :  $objUser->community_permlink,
        ];
    }
    public function beforeAction($action)
    {
        \Yii::$app->request->enableCsrfValidation = false;
        $this->enableCsrfValidation = false;
        \Yii::$app->response->format = 'json';
        return parent::beforeAction($action);
    }

    public function actionLogin()
    {
        if(\Yii::$app->request->post('golos_nick')!==null) {
            $objUser = Users::findOne(['golos_nick' => \Yii::$app->request->post('golos_nick')]);
            if(!is_object($objUser)) {
                $objUser = new Users();
                $objUser->golos_nick = \Yii::$app->request->post('golos_nick');
                $objUser->golos_pub_key = \Yii::$app->request->post('golos_pub_key');
                if(!$objUser->save()) {
                    return [
                        'status' => 'error',
                        'msg' => 'Не могу добавить пользователя'
                    ];
                }
            }
        }
        if(\Yii::$app->user->loginByAccessToken(\Yii::$app->request->post('golos_nick'), Users::GOLOS_NICK) === null) {
            if(\Yii::$app->user->loginByAccessToken(\Yii::$app->request->post('golos_pub_key'), Users::GOLOS_PUB_KEY) === null) {
                return [
                    'status' => 'error',
                ];
            }
        }

        return ['status' => 'ok', 'user_id' => \Yii::$app->user->getId()];
    }

    public function actionLogout()
    {
        if(!\Yii::$app->user->isGuest) {
            \Yii::$app->user->logout();
        }
        $this->redirect('/');
    }
}
