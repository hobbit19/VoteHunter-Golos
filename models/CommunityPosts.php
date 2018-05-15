<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "community_posts".
 *
 * @property int $id
 * @property string $author
 * @property string $permlink
 * @property int $user_id
 * @property string $secret
 */
class CommunityPosts extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'community_posts';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['author', 'permlink', 'user_id', 'secret'], 'required'],
            [['user_id'], 'integer'],
            [['author', 'permlink', 'secret'], 'string', 'max' => 256],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'author' => 'Author',
            'permlink' => 'Permlink',
            'user_id' => 'User ID',
            'secret' => 'Secret',
        ];
    }
}
