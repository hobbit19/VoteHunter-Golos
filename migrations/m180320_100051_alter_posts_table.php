<?php

use yii\db\Migration;

/**
 * Class m180320_100051_alter_posts_table
 */
class m180320_100051_alter_posts_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->alterColumn('posts', 'patron_only', $this->integer(10)->unsigned()->notNull()->defaultValue(0));
        $this->renameColumn('posts', 'patron_only', 'patrons_only');
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        echo "m180320_100051_alter_posts_table cannot be reverted.\n";

        return false;
    }

    /*
    // Use up()/down() to run migration code without a transaction.
    public function up()
    {

    }

    public function down()
    {
        echo "m180320_100051_alter_posts_table cannot be reverted.\n";

        return false;
    }
    */
}
