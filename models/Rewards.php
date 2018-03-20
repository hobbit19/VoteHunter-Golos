<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "rewards".
 *
 * @property int $id
 * @property int $user_id
 * @property string $amount
 * @property string $reward
 * @property string $title
 */
class Rewards extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'rewards';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['user_id'], 'required'],
            [['user_id'], 'integer'],
            [['amount'], 'number', 'min' => 1],
            [['reward'], 'string'],
            [['reward'], 'required'],
            [['title'], 'string', 'max' => 100],
            [['title'], 'required'],
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
            'amount' => 'Amount',
            'reward' => 'Reward',
        ];
    }
}
