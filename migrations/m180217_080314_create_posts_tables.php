<?php

use yii\db\Migration;

/**
 * Class m180217_080314_create_posts_tables
 */
class m180217_080314_create_posts_tables extends Migration
{
    /**
     * @inheritdoc
     */
    public function safeUp()
    {
        $this->createTable('posts', [
            'id' => $this->primaryKey(),
            'title' => $this->string(256),
            'description' => $this->text(),
            'encoded' => $this->text(),
            'video_url' => $this->string(512),
            'price' => $this->decimal(12,8),
            'secret_key' => $this->string(512),
            'permlink' => $this->string(512),
            'not_encrypted' => $this->boolean()->defaultValue(1)
        ]);
    }

    /**
     * @inheritdoc
     */
    public function safeDown()
    {
        echo "m180217_080314_create_posts_tables cannot be reverted.\n";

        return false;
    }

    /*
    // Use up()/down() to run migration code without a transaction.
    public function up()
    {

    }

    public function down()
    {
        echo "m180217_080314_create_posts_tables cannot be reverted.\n";

        return false;
    }
    */
}
