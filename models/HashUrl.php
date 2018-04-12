<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "hash_url".
 *
 * @property string $hash
 * @property int $used
 */
class HashUrl extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'hash_url';
    }

    public static function primaryKey()
    {
        return ['hash'];
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'hash' => 'Hash',
            'used' => 'Used',
        ];
    }
}
