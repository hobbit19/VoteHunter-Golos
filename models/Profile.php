<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "profile".
 *
 * @property int $id
 * @property string $user_id
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
 */
class Profile extends \yii\db\ActiveRecord
{
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
            [['about'], 'string'],
            [['user_id', 'fio', 'vk', 'youtube', 'twitter', 'facebook'], 'string', 'max' => 256],
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
}
