<?php

use yii\db\Migration;

/**
 * Class m180320_092137_change_amount_type
 */
class m180320_092137_change_amount_type extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->alterColumn('goals', 'amount', $this->integer(10)->unsigned()->notNull()->defaultValue(0));
        $this->alterColumn('rewards', 'amount', $this->integer(10)->unsigned()->notNull()->defaultValue(0));
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        echo "m180320_092137_change_amount_type cannot be reverted.\n";

        return false;
    }

    /*
    // Use up()/down() to run migration code without a transaction.
    public function up()
    {

    }

    public function down()
    {
        echo "m180320_092137_change_amount_type cannot be reverted.\n";

        return false;
    }
    */
}
