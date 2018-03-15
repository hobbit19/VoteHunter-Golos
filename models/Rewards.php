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
            [['amount'], 'number'],
            [['reward'], 'string'],
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
