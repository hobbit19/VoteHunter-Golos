<?php

use yii\db\Migration;

/**
 * Class m180217_080720_create_profile_tables
 */
class m180217_080720_create_profile_tables extends Migration
{
    /**
     * @inheritdoc
     */
    public function safeUp()
    {
        $this->createTable('profile', [
            'id' => $this->primaryKey(),
            'user_id' => $this->string(256),
            'big_logo' => $this->string(512),
            'about' => $this->text(),
            'fio' => $this->string(256),
            'avatar' => $this->string(512),
            'vk' => $this->string(256),
            'youtube' => $this->string(256),
            'twitter' => $this->string(256),
            'facebook' => $this->string(256),
        ]);
    }

    /**
     * @inheritdoc
     */
    public function safeDown()
    {
        echo "m180217_080720_create_profile_tables cannot be reverted.\n";

        return false;
    }

    /*
    // Use up()/down() to run migration code without a transaction.
    public function up()
    {

    }

    public function down()
    {
        echo "m180217_080720_create_profile_tables cannot be reverted.\n";

        return false;
    }
    */
}
