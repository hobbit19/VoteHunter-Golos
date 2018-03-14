<?php
/**
 * Created by PhpStorm.
 * User: user
 * Date: 2/17/18
 * Time: 1:34 PM
 */

namespace app\controllers;


use app\api\golos\GolosApi;
use app\helpers\ImageHelper;
use app\models\Goal;
use app\models\Profile;
use yii\web\Controller;
use yii\web\UploadedFile;

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
            $arrBlockChainProfile = $objGolosApi->getAccount(\Yii::$app->user->identity->golos_nick, GolosApi::ACCOUNT_GOLOS_PROFILE);
            $objProfile->name = isset($arrBlockChainProfile['name']) ? $arrBlockChainProfile['name'] : '';
            $objProfile->about = isset($arrBlockChainProfile['about']) ? $arrBlockChainProfile['about'] : '';
            $objProfile->profile_image = isset($arrBlockChainProfile['profile_image']) ? $arrBlockChainProfile['profile_image'] : '';
            $objProfile->cover_image = isset($arrBlockChainProfile['cover_image']) ? $arrBlockChainProfile['cover_image'] : '';
            $objProfile->cat_id = 0;
            $objProfile->promo_video = '';
            $objProfile->url = \Yii::$app->user->getIdentity()->golos_nick;
            $objProfile->save();
        }

        $arrGoals = Goal::find()->where(['user_id' => \Yii::$app->user->getId()])->asArray()->all();
        if(count($arrGoals) == 0) {
            $arrGoals[] = [
                'amount' =>0,
                'goal' => ''
                ];
        }

        return [
            'status' => 'ok',
            'profile' => $objProfile->toArray(),
            'goals' => $arrGoals,
            'rewards' => [],
        ];
    }

    public function actionUpdate()
    {
        if(\Yii::$app->user->isGuest) {
            return [
                'status' => 'error',
                'msg' => 'Not logged in'
            ];
        }

        $objProfile = Profile::findOne(['user_id' => \Yii::$app->user->getId()]);
        if(!is_object($objProfile)) {
            return [
                'status' => 'error',
                'msg' => 'Profile not found'
            ];

        }
        $arrData = json_decode(\Yii::$app->request->post('profile'), true);
        unset($arrData['id']);
        $objProfile->setAttributes($arrData, false);
        if($objProfile->save()) {
            $objProfileImage = UploadedFile::getInstanceByName('new_profile_image');
            if(!is_null($objProfileImage)) {
                ImageHelper::processProfileImage($objProfileImage);
                $objProfile->refresh();
                //process new profile
            }
            $objCoverImage = UploadedFile::getInstanceByName('new_cover_image');
            if(!is_null($objCoverImage)) {
                //process new cover image
                ImageHelper::processCoverImage($objCoverImage);
                $objProfile->refresh();
            }

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
    public function actionGoals()
    {
        if(!empty(\Yii::$app->request->post('id'))) {
            $objGoal = Goal::findOne((int) \Yii::$app->request->post('id'));
        } else {
            $objGoal = Goal::findOne(['user_id' => \Yii::$app->user->getId()]);
        }
        if(!is_object($objGoal)) {
            $objGoal = new Goal();
            $objGoal->user_id = \Yii::$app->user->getId();
        }
        $objGoal->amount = \Yii::$app->request->post('amount');
        $objGoal->goal = \Yii::$app->request->post('goal');
        if($objGoal->save()) {
            return [
                'status' => 'ok',
                'goal' => $objGoal->toArray(),
            ];
        }
        return [
            'status' => 'error',
            'msg' => 'Cannot update goal',
        ];

    }
}