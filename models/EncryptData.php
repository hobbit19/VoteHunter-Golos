<?php
/**
 * Created by PhpStorm.
 * User: user
 * Date: 2/17/18
 * Time: 8:03 PM
 */

namespace app\models;


class EncryptData
{
    private $key;
    function __construct($key)
    {
        $this->key = \Sodium\crypto_generichash($key);
    }

    public function encryptText($strPlaintText)
    {
        return $this->encrypt($strPlaintText);
    }

    public function decryptText($strEncrypted)
    {
        return $this->decrypt($strEncrypted);
    }

    public function encryptJson($mixData)
    {
        if(is_array($mixData)) {
            $strJson = \yii\helpers\Json::encode($mixData);
        } else {
            $strJson = $mixData;
        }
        return $this->encrypt($strJson);
    }

    public function decryptJson($strEncrypted, $boolAsArray = true)
    {
        $strPlaintText = $this->decrypt($strEncrypted);
        return $boolAsArray ? \yii\helpers\Json::decode($strPlaintText) : $strPlaintText;
    }

    public function encrypt($strPlaintText)
    {
        $nonce = \Sodium\randombytes_buf(\Sodium\CRYPTO_SECRETBOX_NONCEBYTES);
        $strCipherText = base64_encode(\Sodium\crypto_secretbox($strPlaintText, $nonce, $this->key));
        return $strCipherText . '::' . base64_encode($nonce);
    }

    public function decrypt($strEncrypted)
    {
        $arrTmp = explode('::', $strEncrypted);
        $strEncryptedText = base64_decode($arrTmp[0]);
        $nonce = base64_decode($arrTmp[1]);
        $strPlaintText = \Sodium\crypto_secretbox_open($strEncryptedText, $nonce, $this->key);
        return $strPlaintText;
    }

    public function encryptDesk(Workspace $objDesk)
    {
        /* @var \app\modules\workspace\models\WorkspaceItem $objItem */
        foreach ($objDesk->items as $objItem) {
            $objItem->secure = true;
            $objItem->save();
        }
    }
    public function decryptDesk(Workspace $objDesk)
    {
        /* @var \app\modules\workspace\models\WorkspaceItem $objItem */
        foreach ($objDesk->items as $objItem) {
            unset($objItem->secure);
            $objItem->save();
        }
    }
}