<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "operations".
 *
 * @property int $id
 * @property string $user_from
 * @property string $user_to
 * @property string $symbol
 * @property int $sum_usd
 * @property string $sum_coin
 * @property string $added
 */
class Operation extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'operations';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['user_from', 'user_to', 'symbol', 'sum_usd', 'sum_coin'], 'required'],
            [['sum_usd'], 'integer'],
            [['sum_coin'], 'number'],
            [['added'], 'safe'],
            [['user_from', 'user_to'], 'string', 'max' => 50],
            [['symbol'], 'string', 'max' => 20],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'user_from' => 'User From',
            'user_to' => 'User To',
            'symbol' => 'Symbol',
            'sum_usd' => 'Sum Usd',
            'sum_coin' => 'Sum Coin',
            'added' => 'Added',
        ];
    }
}
