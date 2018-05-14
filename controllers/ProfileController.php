<?php
/**
 * Created by PhpStorm.
 * User: user
 * Date: 2/17/18
 * Time: 1:34 PM
 */

namespace app\controllers;


use app\api\golos\GolosApi;
use app\api\steem\SteemApi;
use app\helpers\ImageHelper;
use app\models\Goal;
use app\models\Operation;
use app\models\Patron;
use app\models\Posts;
use app\models\Profile;
use app\models\ProfileContents;
use app\models\Rates;
use app\models\Rewards;
use app\models\User;
use app\models\Users;
use yii\db\Query;
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
            $arrGoals = Goal::find()->where(['user_id' => $objProfile->user_id])->asArray()->all();
            $arrRewards = Rewards::find()->where(['user_id' => $objProfile->user_id])->asArray()->all();

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
            if(!\Yii::$app->user->isGuest) {
                $isPatron = Patron::findOne(['user_id' => $objProfile->user_id, 'patron_id' => \Yii::$app->user->getId(), 'status' => Patron::STATUS_ACTIVE]);
            }
            $intPatronsCount = Patron::find()->where(['user_id' => $objProfile->user_id, 'status' => Patron::STATUS_ACTIVE])->count();
            $intTotalReceived = Operation::find()->where(['user_to' => $objProfile->user->golos_nick])->sum('sum_usd');
            return [
                'status' => 'ok',
                'profile' => $objProfile->toArray() +
                    ['goals' => $arrGoals, 'rewards' => $arrRewards] + ['patrons_count' => $intPatronsCount, 'total_received' => $intTotalReceived] +
                    ['nick' => $objProfile->user->golos_nick]+
                    ['community_permlink' => empty($objProfile->user->community_permlink) ? $objProfile->user->makeCommunityPermLink() :  $objProfile->user->community_permlink] +
                    ['isPatron' => empty($isPatron) ? false : true]
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
        $objGolosApi = new SteemApi();
        $arrBlockChainData = $objGolosApi->getAccount(\Yii::$app->user->identity->golos_nick, GolosApi::ACCOUNT_GOLOS_PROFILE);
        if(!is_object($objProfile)) {
            $objProfile = new Profile();
            $objProfile->user_id = \Yii::$app->user->getId();
            if($arrBlockChainData !== false) {
                $arrBlockChainProfile = $arrBlockChainData['profile'];
            } else {
                $arrBlockChainProfile = [];
            }
            $objProfile->name = isset($arrBlockChainProfile['name']) ? $arrBlockChainProfile['name'] : '';
            $objProfile->about = isset($arrBlockChainProfile['about']) ? $arrBlockChainProfile['about'] : '';
            $objProfile->profile_image = isset($arrBlockChainProfile['profile_image']) ? $arrBlockChainProfile['profile_image'] : '';
            $objProfile->cover_image = isset($arrBlockChainProfile['cover_image']) ? $arrBlockChainProfile['cover_image'] : '';
            $objProfile->list_image = '';
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
            'profile' => $objProfile->toArray() + ['contents' => $objProfile->editorContents->contents] + ['community_permlink' => !empty($objProfile->user->community_permlink) ? $objProfile->user->makeCommunityPermLink() :  $objProfile->user->community_permlink],
            'json_metadata' => $arrBlockChainData['json_metadata'],
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

            $objListImage = UploadedFile::getInstanceByName('new_list_image');
            if(!is_null($objListImage)) {
                //process new cover image
                ImageHelper::processListImage($objListImage);
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
        $objReward->title = \Yii::$app->request->post('title');
        if($objReward->save()) {
            return [
                'status' => 'ok',
                'reward' => $objReward->toArray(),
            ];
        }
        return [
            'status' => 'error',
            'msg' => 'Cannot update reward',
            'errors' => $objReward->getErrors(),
        ];

    }

    public function actionList()
    {
        $objQuery = Profile::find()->where(['<>', 'cover_image', ''])
            ->andWhere(['<>', 'list_image', ''])
            ->andWhere(['<>', 'profile_image', ''])
            ->andWhere(['<>', 'cover_image', ''])
            ->limit((int) \Yii::$app->request->get('limit', Profile::DEFAULT_LIST_LIMIT));
        switch(\Yii::$app->request->get('order')) {
            case 'last':
                $objQuery->orderBy(['id' => SORT_DESC]);
                break;
            case 'popular':
                $objQuery->orderBy(['id' => SORT_DESC]);
                break;
            default:
                $objQuery->orderBy(['id' => SORT_DESC]);
        }
        $arrDbProfiles = $objQuery->all();
        $arrProfiles = [];
        foreach($arrDbProfiles as $objProfile) {
            $arrProfiles[] = $objProfile->toArray(['user_id', 'url', 'profile_image', 'about', 'name', 'cover_image', 'list_image']);
        }
        return [
            'status' => 'ok',
            'authors' => $arrProfiles
        ];
    }

    public function actionGetRewards()
    {
        $objUser = Users::findOne((int)\Yii::$app->request->get('user_id'));
        if(empty($objUser)) {
            return [
                'status' => 'error',
                'msg' => \Yii::t('app', 'User not found')
            ];
        }
        $arrRewards = Rewards::find()->where(['user_id' => \Yii::$app->request->get('user_id')])
            ->select(['id', 'reward', 'amount', 'title'])->asArray()->all();

        $arrRates = Rates::findOne(['symbol' => 'GOLOS']);
        array_unshift($arrRewards, [
           'id' => 0,
           'reward' => 'No reward, I just want to support',
           'amount' => 1,
           'title' => '$1+ per month',
        ]);

        array_walk($arrRewards, function (&$item, $key, $arrRates) use ($objUser) {
           $item['golos'] = sprintf('%01.3f GOLOS', $item['amount'] / $arrRates['price_usd']);
           $item['nick'] = $objUser->golos_nick;
        }, $arrRates);

        return [
            'status' => 'ok',
            'rewards' => $arrRewards
        ];
    }

    public function actionSetAsPatron()
    {

        $arrOper = \Yii::$app->request->post('op_data');
        $objOperation = new Operation();
        $objOperation->user_from = \Yii::$app->request->post('user_from');
        $objOperation->user_to = $arrOper['nick'];
        $objOperation->symbol = 'GOLOS';
        $objOperation->sum_usd = $arrOper['amount'];
        $objOperation->sum_coin = floatval($arrOper['golos']);
        if($objOperation->save()) {
            $objUser = User::findOne(['golos_nick' => $objOperation->user_to]);
            $objUserPatron = User::findOne(['golos_nick' => $objOperation->user_from]);
            if(!is_object($objUserPatron)) {
                $objUserPatron = new User();
                $objUserPatron->golos_nick = $objOperation->user_from;
                $objUserPatron->save();
            }
            $objPatron = new Patron();
            $objPatron->user_id = $objUser->id;
            $objPatron->patron_id = $objUserPatron->id;
            $objPatron->status = Patron::STATUS_ACTIVE;
            $objPatron->patron_sum = $objOperation->sum_usd;
            $objPatron->save();
            if(\Yii::$app->user->isGuest) {
                \Yii::$app->user->loginByAccessToken(\Yii::$app->request->post('user_from'), Users::GOLOS_NICK);
            }

            $objProfile = Profile::findOne(['user_id' => $objUser->id]);
            return [
                'status' => 'ok',
                'redirect' => '/'. $objProfile->url
            ];
        }
        return [
            'status' => 'error',
            'msg' => \Yii::t('app', 'Can not save operation')
        ];
    }

    public function actionGetPatrons()
    {
        $intUser = \Yii::$app->request->get('user_id', \Yii::$app->user->isGuest ? 0 : \Yii::$app->user->getId());
        $arrPatrons = [];
        if($intUser > 0) {
            $arrProfiles = Profile::find()->where(['user_id' => (new Query())->select(['patron_id'])->from('patrons')->where(['user_id'=>$intUser])])->all();
            foreach ($arrProfiles as $objProfile) {
                $arrPatrons[] = $objProfile->toArray(['name', 'url', 'profile_image']);
            }
        }
        return [
            'status' => 'ok',
            'patrons' => $arrPatrons
        ];
    }

    public function actionUserStats()
    {
        if (\Yii::$app->user->isGuest) {
            return [
                'status' => 'error',
                'msg' => \Yii::t('app', 'User not found')
            ];
        }

        $intPosts = Posts::find()->where(['user_id' => \Yii::$app->user->getId()])->count();
        $intSupporters = Patron::find()->where(['user_id' => \Yii::$app->user->getId()])->count();
        $objGolosApi = new SteemApi();
        $arrBlockChainData = $objGolosApi->getAccount(\Yii::$app->user->identity->golos_nick, GolosApi::ACCOUNT_GOLOS_PROFILE);
        if($arrBlockChainData !== false) {
            $objRates = Rates::findOne(['symbol' => 'STEEM']);
            $fltGolos = floatval($arrBlockChainData['balance']);
            $sum = $fltGolos * $objRates['price_usd'];
        } else {
            $fltGolos = $sum =0;
        }
        return [
            'status' => 'ok',
            'posts' => $intPosts,
            'supporters' => $intSupporters,
            'golos' => sprintf("%01.3f", $fltGolos),
            'sum' => sprintf("%01.2f", $sum)
        ];
    }

    public function actionAvatars()
    {
        $arrAvatars = [];
        $arrAuthors = \Yii::$app->request->post('authors');
        if(empty($arrAuthors)) {
            return [
                'status' => 'ok',
                'avatars' => $arrAvatars,
            ];
        }
        $arrAuthors = array_values($arrAuthors);
        $arrData = User::find()->select(['id','golos_nick'])->where(['golos_nick' => $arrAuthors])->asArray()->all();
        if(empty($arrData) > 0) {
            return [
                'status' => 'ok',
                'avatars' => $arrAvatars,
            ];
        }
        $arrUsers = [];
        foreach ($arrData as $arrUser) {
            $arrUsers[$arrUser['id']] = $arrUser['golos_nick'];
        }
        unset($arrData);
        $arrData = Profile::find()->where(['user_id' => array_keys($arrUsers)])->select(['user_id', 'profile_image'])->asArray()->all();
        foreach ($arrData as $arrItem) {
            $arrAvatars[$arrUsers[$arrItem['user_id']]] = !empty($arrItem['profile_image']) ? $arrItem['profile_image'] : Profile::DEFAULT_AVATAR ;
        }
        return [
            'status' => 'ok',
            'avatars' => $arrAvatars,
        ];

    }

    public function actionDeleteReward()
    {
        if(\Yii::$app->user->isGuest || \Yii::$app->user->getId() != \Yii::$app->request->post('user_id')) {
            return [
                'status' => 'error',
                'msg' => \Yii::t('app', 'Access denied')
            ];
        }
        $objReward = Rewards::findOne(['id' => \Yii::$app->request->post('id'), 'user_id' => \Yii::$app->request->post('user_id')]);
        if(empty($objReward)) {
            return [
                'status' => 'error',
                'msg' => \Yii::t('app', 'Not found'),
            ];
        }
        if(empty($objReward->deleted)) {
            $objReward->deleted = true;
            if($objReward->save()) {
                return [
                    'status' => 'ok',
                ];
            } else {
                return [
                    'status' => 'error',
                    'msg' => \Yii::t('app', 'Cannot delete reward'),
                ];
            }
        }
        if($objReward->delete()) {
            return [
                'status' => 'ok',
            ];
        }
        return [
            'status' => 'error',
            'msg' => \Yii::t('app', 'Cannot delete reward'),
        ];
    }
}


