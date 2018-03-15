<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "profile_contents".
 *
 * @property int $id
 * @property int $profile_id
 * @property string $contents
 */
class ProfileContents extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'profile_contents';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['profile_id'], 'required'],
            [['profile_id'], 'integer'],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'profile_id' => 'Profile ID',
            'contents' => 'Contents',
        ];
    }
    
    
}
