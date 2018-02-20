<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "profile".
 *
 * @property int $id
 * @property string $user_id
 * @property string $big_logo
 * @property string $about
 * @property string $fio
 * @property string $avatar
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
            [['big_logo', 'avatar'], 'string', 'max' => 512],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'user_id' => 'User ID',
            'big_logo' => 'Big Logo',
            'about' => 'About',
            'fio' => 'Fio',
            'avatar' => 'Avatar',
            'vk' => 'Vk',
            'youtube' => 'Youtube',
            'twitter' => 'Twitter',
            'facebook' => 'Facebook',
        ];
    }
}
