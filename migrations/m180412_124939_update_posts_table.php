<?php

use yii\db\Migration;

/**
 * Class m180412_124939_update_posts_table
 */
class m180412_124939_update_posts_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->addColumn('posts', 'thumbnail' , $this->string('256'));

    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        echo "m180412_124939_update_posts_table cannot be reverted.\n";

        return false;
    }

    /*
    // Use up()/down() to run migration code without a transaction.
    public function up()
    {

    }

    public function down()
    {
        echo "m180412_124939_update_posts_table cannot be reverted.\n";

        return false;
    }
    */
}
