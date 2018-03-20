<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "patrons".
 *
 * @property int $id
 * @property int $user_id
 * @property int $patron_id
 * @property int $patron_sum
 * @property int $status
 * @property string $changed
 */
class Patron extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'patrons';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['user_id', 'patron_id', 'patron_sum', 'status'], 'required'],
            [['user_id', 'patron_id', 'patron_sum', 'status'], 'integer'],
            [['changed'], 'safe'],
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
            'patron_id' => 'Patron ID',
            'patron_sum' => 'Patron Sum',
            'status' => 'Status',
            'changed' => 'Changed',
        ];
    }
}
