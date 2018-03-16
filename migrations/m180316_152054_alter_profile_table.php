<?php

use yii\db\Migration;

/**
 * Class m180316_152054_alter_profile_table
 */
class m180316_152054_alter_profile_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->addColumn('profile', 'cover_text_color', $this->string(50)->notNull()->defaultValue('white'));

    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        echo "m180316_152054_alter_profile_table cannot be reverted.\n";

        return false;
    }

    /*
    // Use up()/down() to run migration code without a transaction.
    public function up()
    {

    }

    public function down()
    {
        echo "m180316_152054_alter_profile_table cannot be reverted.\n";

        return false;
    }
    */
}
