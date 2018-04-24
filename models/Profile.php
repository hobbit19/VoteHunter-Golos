<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "profile".
 *
 * @property int $id
 * @property integer $user_id
 * @property string $about
 * @property string $name
 * @property string $profile_image
 * @property string $cover_image
 * @property string $list_image
 * @property string $promo_video
 * @property string $url
 * @property string $vk
 * @property string $youtube
 * @property string $twitter
 * @property string $facebook
 * @property string $description
 * @property integer $cat_id
 */
class Profile extends \yii\db\ActiveRecord
{
    const DEFAULT_LIST_LIMIT = 10;
    const DEFAULT_AVATAR = '/images/ava_placeholder.svg';

    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'profile';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['url'], 'filter', 'filter' => function($value) {
                return strtolower(trim(preg_replace("/[^0-9A-Z\-\_]/i","", $value)));
            }],

        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
        ];
    }

    public function afterSave($insert, $changedAttributes)
    {
        if(isset($changedAttributes['cat_id'])) {
            //update cat counter
            Categories::updateUserCounters($changedAttributes['cat_id'], $this->cat_id);
        }

        parent::afterSave($insert, $changedAttributes);
    }


    public function getEditorContents()
    {
        return $this->hasOne(ProfileContents::className(),['profile_id' => 'id']);
    }

    public function getUser()
    {
        return $this->hasOne(User::className(),['id' => 'user_id']);
    }
}
