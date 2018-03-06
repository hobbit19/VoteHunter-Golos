<?php
/**
 * Created by PhpStorm.
 * User: user
 * Date: 2/17/18
 * Time: 1:34 PM
 */

namespace app\controllers;


use app\api\golos\GolosApi;
use app\models\Profile;
use yii\web\Controller;

class ProfileController extends Controller
{
    public function beforeAction($action)
    {
        \Yii::$app->request->enableCsrfValidation = false;
        $this->enableCsrfValidation = false;
        \Yii::$app->response->format = 'json';
        return parent::beforeAction($action);
    }

    public function actionGet() {
        if(\Yii::$app->user->isGuest) {
            return [
                'status' => 'error',
                'msg' => 'Not logged in'
            ];
        }
        $objProfile = Profile::findOne(['user_id' => \Yii::$app->user->getId()]);
        if(!is_object($objProfile)) {
            $objProfile = new Profile();
            $objProfile->user_id = \Yii::$app->user->getId();
            $objGolosApi = new GolosApi();
            $arrBlockChainProfile = $objGolosApi->getAccount(\Yii::$app->user->identity->golos_nick);
            $objProfile->name = isset($arrBlockChainProfile['name']) ? $arrBlockChainProfile['name'] : '';
            $objProfile->about = isset($arrBlockChainProfile['about']) ? $arrBlockChainProfile['about'] : '';
            $objProfile->profile_image = isset($arrBlockChainProfile['profile_image']) ? $arrBlockChainProfile['profile_image'] : '';
            $objProfile->cover_image = isset($arrBlockChainProfile['cover_image']) ? $arrBlockChainProfile['cover_image'] : '';
            $objProfile->save();
        }

        return [
            'status' => 'ok',
            'profile' => $objProfile->toArray()
        ];
    }

    public function actionUpdate()
    {
        if(empty(\Yii::$app->request->post('id'))) {
            return [
                'status' => 'error',
                'msg' => 'ID required'
            ];
        }
        $objProfile = Profile::findOne((int)\Yii::$app->request->post('id'));
        if(!is_object($objProfile)) {
            return [
                'status' => 'error',
                'msg' => 'Profile not found'
            ];

        }
        $objProfile->load(\Yii::$app->request->post());
        if($objProfile->save()) {
            return [
                'status' => 'ok',
                'profile' => $objProfile->toArray(),
            ];
        }
        return [
            'status' => 'error',
            'profile' => 'Cannot update profile',
        ];

    }
}