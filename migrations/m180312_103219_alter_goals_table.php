<?php

use yii\db\Migration;

/**
 * Class m180312_103219_alter_goals_table
 */
class m180312_103219_alter_goals_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->addColumn('goals','amount', $this->decimal(8,3)->notNull()->defaultValue(0.0));
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        echo "m180312_103219_alter_goals_table cannot be reverted.\n";

        return false;
    }

    /*
    // Use up()/down() to run migration code without a transaction.
    public function up()
    {

    }

    public function down()
    {
        echo "m180312_103219_alter_goals_table cannot be reverted.\n";

        return false;
    }
    */
}
