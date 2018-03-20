<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "rates".
 *
 * @property int $id
 * @property string $symbol
 * @property string $price_usd
 * @property string $price_btc
 */
class Rates extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'rates';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['price_usd', 'price_btc'], 'number'],
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
            'symbol' => 'Symbol',
            'price_usd' => 'Price Usd',
            'price_btc' => 'Price Btc',
        ];
    }
}
