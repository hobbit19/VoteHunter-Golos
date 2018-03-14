<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "goals".
 *
 * @property int $id
 * @property int $user_id
 * @property string $added
 * @property string $goal
 * @property string $collected
 * @property int $reached
 */
class Goal extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'goals';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['user_id'], 'required'],
            [['user_id'], 'integer'],
            [['added'], 'safe'],
            [['goal'], 'string'],
            [['collected'], 'number'],
            [['reached'], 'string', 'max' => 1],
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
            'added' => 'Added',
            'goal' => 'Goal',
            'collected' => 'Collected',
            'reached' => 'Reached',
        ];
    }
}
