<?php
/**
 * Created by PhpStorm.
 * User: user
 * Date: 2/17/18
 * Time: 1:34 PM
 */

namespace app\controllers;


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
        if(empty(\Yii::$app->request->get('id'))) {
            return [
                'status' => 'error',
                'msg' => 'ID required'
            ];
        }
        $objProfile = Profile::findOne((int)\Yii::$app->request->get('id'));
        if(!is_object($objProfile)) {
            return [
                'status' => 'error',
                'msg' => 'Profile not found'
            ];

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