<?php

use yii\db\Migration;

/**
 * Class m180315_093950_alter_table_profile
 */
class m180315_093950_alter_table_profile extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->addColumn('profile', 'description', $this->text());
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        echo "m180315_093950_alter_table_profile cannot be reverted.\n";

        return false;
    }

    /*
    // Use up()/down() to run migration code without a transaction.
    public function up()
    {

    }

    public function down()
    {
        echo "m180315_093950_alter_table_profile cannot be reverted.\n";

        return false;
    }
    */
}
