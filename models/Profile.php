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
}
