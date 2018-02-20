<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "paid_posts".
 *
 * @property int $id
 * @property int $user_id
 * @property int $post_id
 * @property string $sum
 * @property string $pay_date
 * @property string $tx_id
 */
class PaidPosts extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'paid_posts';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
//            [['user_id', 'post_id'], 'integer'],
//            [['sum'], 'number'],
//            [['pay_date'], 'safe'],
//            [['tx_id'], 'string', 'max' => 256],
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
            'post_id' => 'Post ID',
            'sum' => 'Sum',
            'pay_date' => 'Pay Date',
            'tx_id' => 'Tx ID',
        ];
    }
}
