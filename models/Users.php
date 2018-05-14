<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "users".
 *
 * @property int $id
 * @property string $golos_nick
 * @property string $golos_pub_key
 * @property string $community_permlink
 */
class Users extends \yii\db\ActiveRecord
{
    const GOLOS_NICK = 'nick';
    const GOLOS_PUB_KEY = 'key';
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'users';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['golos_nick'], 'string', 'max' => 256],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'golos_nick' => 'Golos Nick',
        ];
    }
    public function getProfile()
    {
        return self::hasOne(Profile::className(), ['user_id' => 'id']);
    }

    public function makeCommunityPermLink()
    {
        $this->community_permlink = 'usource-' . $this->golos_nick . '-community-' . strtolower(\Yii::$app->security->generateRandomString(4));
        $this->updateAttributes(['community_permlink']);
        return $this->community_permlink;
    }
}
