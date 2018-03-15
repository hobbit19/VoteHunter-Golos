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
use app\models\ProfileContents;
use app\models\Rewards;
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

    public function actionGetByUrl(){
        if(empty(\Yii::$app->request->get('url'))) {
            return [
                'status' => 'error',
                'msg' => 'Not found'
            ];
        }
        $strUrl = preg_replace("/[^0-9a-z\-\_]+/", "", \Yii::$app->request->get('url'));
        $objProfile = Profile::findOne(['url' => $strUrl]);
        if(is_object($objProfile)) {
            return [
                'status' => 'ok',
                'profile' => $objProfile->toArray()
            ];
        }
        return [
            'status' => 'error',
            'msg' => 'Not found'
        ];

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
            if($objProfile->save()) {
                $objEditorContents = new ProfileContents();
                $objEditorContents->profile_id = $objProfile->getPrimaryKey();
                $objEditorContents->save();
            }
        }
        if(!is_object($objProfile->editorContents)) {
            $objEditorContents = new ProfileContents();
            $objEditorContents->profile_id = $objProfile->getPrimaryKey();
            if($objEditorContents->save()) {
                $objProfile->refresh();
            }

        }

        $arrGoals = Goal::find()->where(['user_id' => \Yii::$app->user->getId()])->asArray()->all();
        $arrRewards = Rewards::find()->where(['user_id' => \Yii::$app->user->getId()])->asArray()->all();

        if(count($arrGoals) == 0) {
            $arrGoals[] = [
                'amount' =>0,
                'goal' => ''
                ];
        }

        if(count($arrRewards) == 0) {
            $arrRewards[] = [
                'amount' =>0,
                'goal' => ''
            ];
        }


        return [
            'status' => 'ok',
            'profile' => $objProfile->toArray() + ['contents' => $objProfile->editorContents->contents],
            'goals' => $arrGoals,
            'rewards' => $arrRewards,
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
        $arrContents = $arrData['contents'];
        unset($arrData['id'], $arrData['contents']);
        $objProfile->setAttributes($arrData, false);
        if($objProfile->save()) {

            $objProfile->editorContents->contents = $arrContents;
            $objProfile->editorContents->save();

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

    public function actionRewards()
    {
        if(!empty(\Yii::$app->request->post('id'))) {
            $objReward = Rewards::findOne((int) \Yii::$app->request->post('id'));
        } else {
            $objReward = new Rewards();
            $objReward->user_id = \Yii::$app->user->getId();

        }
//        if(!is_object($objReward)) {
//            $objReward = new Rewards();
//            $objReward->user_id = \Yii::$app->user->getId();
//        }
        $objReward->amount = \Yii::$app->request->post('amount');
        $objReward->reward = \Yii::$app->request->post('reward');
        if($objReward->save()) {
            return [
                'status' => 'ok',
                'reward' => $objReward->toArray(),
            ];
        }
        return [
            'status' => 'error',
            'msg' => 'Cannot update reward',
        ];

    }
}
