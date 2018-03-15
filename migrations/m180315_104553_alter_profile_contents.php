<?php

use yii\db\Migration;

/**
 * Class m180315_104553_alter_profile_contents
 */
class m180315_104553_alter_profile_contents extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->alterColumn('profile_contents', 'contents', $this->json());
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        echo "m180315_104553_alter_profile_contents cannot be reverted.\n";

        return false;
    }

    /*
    // Use up()/down() to run migration code without a transaction.
    public function up()
    {

    }

    public function down()
    {
        echo "m180315_104553_alter_profile_contents cannot be reverted.\n";

        return false;
    }
    */
}
