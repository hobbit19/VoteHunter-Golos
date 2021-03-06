<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "categories".
 *
 * @property int $id
 * @property string $name
 * @property integer $users_cnt
 */
class Categories extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'categories';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['name'], 'required'],
            [['name'], 'string', 'max' => 100],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'name' => 'Name',
        ];
    }
    public static function updateUserCounters($intOld, $intNew) {
        if($intOld != 0) {
           \Yii::$app->db->createCommand('UPDATE categories SET users_cnt = users_cnt -1 WHERE id = :catId')->bindParam(':catId', $intOld)->execute();
        }

        if($intNew != 0) {
            \Yii::$app->db->createCommand('UPDATE categories SET users_cnt = users_cnt + 1 WHERE id = :catId')->bindParam(':catId', $intNew)->execute();
        }
    }
    public function getAuthors()
    {
        return $this->hasMany(Profile::className(), ['cat_id' => 'id']);
    }
}
