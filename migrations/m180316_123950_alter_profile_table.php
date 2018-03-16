<?php

use yii\db\Migration;

/**
 * Class m180316_123950_alter_profile_table
 */
class m180316_123950_alter_profile_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->addColumn('profile', 'list_image', $this->string(512)->defaultValue(''));
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        echo "m180316_123950_alter_profile_table cannot be reverted.\n";

        return false;
    }

    /*
    // Use up()/down() to run migration code without a transaction.
    public function up()
    {

    }

    public function down()
    {
        echo "m180316_123950_alter_profile_table cannot be reverted.\n";

        return false;
    }
    */
}
