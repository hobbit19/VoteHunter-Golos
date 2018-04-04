<?php
/**
 * Created by PhpStorm.
 * User: roma
 * Date: 20.03.18
 * Time: 13:18
 */
namespace app\api\GrapheneNodeClient;


class TestTransaction extends \GrapheneNodeClient\Tools\Transaction
{
    const CHAIN_ID    = [
        self::CHAIN_GOLOS => '5876894a41e6361bde2e73278f07340f2eb8b41c2facd29099de9deef6cdb679',
        self::CHAIN_STEEM => '79276aea5d4877d9a25892eaa01b0adf019d3e5cb12a97478df3298ccdd01673'
    ];


}