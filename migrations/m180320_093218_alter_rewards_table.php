<?php

use yii\db\Migration;

/**
 * Class m180320_093218_alter_rewards_table
 */
class m180320_093218_alter_rewards_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->addColumn('rewards', 'title', $this->string(100)->notNull());
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        echo "m180320_093218_alter_rewards_table cannot be reverted.\n";

        return false;
    }

    /*
    // Use up()/down() to run migration code without a transaction.
    public function up()
    {

    }

    public function down()
    {
        echo "m180320_093218_alter_rewards_table cannot be reverted.\n";

        return false;
    }
    */
}
