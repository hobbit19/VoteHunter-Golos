<?php

use yii\db\Migration;

/**
 * Class m180427_102304_update_rewards_table
 */
class m180427_102304_update_rewards_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->addColumn('rewards', 'deleted', $this->boolean()->notNull()->defaultValue(0));

    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        echo "m180427_102304_update_rewards_table cannot be reverted.\n";

        return false;
    }

    /*
    // Use up()/down() to run migration code without a transaction.
    public function up()
    {

    }

    public function down()
    {
        echo "m180427_102304_update_rewards_table cannot be reverted.\n";

        return false;
    }
    */
}
