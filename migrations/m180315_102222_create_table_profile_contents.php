<?php

use yii\db\Migration;

/**
 * Class m180315_102222_create_table_profile_contents
 */
class m180315_102222_create_table_profile_contents extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable('profile_contents', [
            'id' => $this->primaryKey(),
            'profile_id' => $this->integer(10)->unsigned()->notNull(),
            'contents' => $this->text(),
        ]);

    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        echo "m180315_102222_create_table_profile_contents cannot be reverted.\n";

        return false;
    }

    /*
    // Use up()/down() to run migration code without a transaction.
    public function up()
    {

    }

    public function down()
    {
        echo "m180315_102222_create_table_profile_contents cannot be reverted.\n";

        return false;
    }
    */
}
