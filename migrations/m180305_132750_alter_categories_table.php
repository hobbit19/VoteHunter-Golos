<?php

use yii\db\Migration;

/**
 * Class m180305_132750_alter_categories_table
 */
class m180305_132750_alter_categories_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->addColumn('categories', 'users_cnt', $this->integer(10)->unsigned()->notNull()->defaultValue(0));
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        echo "m180305_132750_alter_categories_table cannot be reverted.\n";

        return false;
    }

    /*
    // Use up()/down() to run migration code without a transaction.
    public function up()
    {

    }

    public function down()
    {
        echo "m180305_132750_alter_categories_table cannot be reverted.\n";

        return false;
    }
    */
}
