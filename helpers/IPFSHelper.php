<?php
/**
 * Created by PhpStorm.
 * User: roma
 * Date: 02.04.18
 * Time: 17:28
 */

namespace app\helpers;


use Cloutier\PhpIpfsApi\IPFS;
use yii\web\UploadedFile;

class IPFSHelper
{
    public static function uploadFileNew($strFieldName, $arrParams = [])
    {
        $objIPFS = new IPFS("localhost", "8080", "5001");
        if(!empty($arrParams['base64'])) {
            $objFile = self::parseBase64FileString($arrParams['base64']);
        } else {
            $objFile = UploadedFile::getInstanceByName($strFieldName);
        }
        if(!is_null($objFile)) {

        }
    }


    public static function uploadFile($strFieldName, $arrParams = [])
    {
        $flag = 0;
        if(!empty($arrParams['base64'])) {
            $objFile = self::parseBase64FileString($arrParams['base64']);
        } else {
            $objFile = UploadedFile::getInstanceByName($strFieldName);
            if(is_null($objFile)) {
                rename($objFile->tempName, \Yii::getAlias('@app/runtime/var/tmp/'). $objFile->name);
                $objFile->tempName = \Yii::getAlias('@app/runtime/var/tmp/'). $objFile->name;
                $flag = 1;
            }
        }
        if(!is_null($objFile)) {
            $arrPost = [
                'file' => new \CURLFile($objFile->tempName, $objFile->type, basename($objFile->tempName)),
//                'recursive' => false,
//                'quieter' => false,
//                'quiet' => true,
            ];
            $objCurl = curl_init();
            curl_setopt($objCurl, CURLOPT_URL, "http://localhost:5001/api/v0/add");
            curl_setopt($objCurl, CURLOPT_HEADER, $flag);
            curl_setopt($objCurl, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($objCurl, CURLOPT_POST, true);
            curl_setopt($objCurl, CURLOPT_POSTFIELDS, $arrPost);
//            curl_setopt($objCurl, CURLOPT_SAFE_UPLOAD, 1);
            curl_setopt($objCurl, CURLOPT_BINARYTRANSFER, 1);
            $result = curl_exec($objCurl);
            //print_r(curl_getinfo($objCurl));
           // var_dump($result);
            curl_close($objCurl);

            if(is_file($objFile->tempName)) {
                unlink($objFile->tempName);
            }
            return json_decode($result, true);
        }
        return false;
    }


    public static function parseBase64FileString(string $strBase64)
    {
        $strDir = \Yii::getAlias('@app/runtime/var/tmp');
        if(!is_dir($strDir)) {
            mkdir($strDir, 0777, true);
        }
        $strTmpName = \Yii::getAlias('@app/runtime/var/tmp/th' . time() .str_replace('/','',substr($strBase64, 65, 8)));
        $arrData = explode(',', $strBase64, 2);
        file_put_contents($strTmpName, base64_decode($arrData[1]));
        if(preg_match('/data:(.*);base64/', $arrData[0], $match))
        {
            $strContentType = $match[1];
        }
        $objFile = new UploadedFile();
        $objFile->name = $strTmpName;
        $objFile->tempName = $strTmpName;
        $objFile->type = $strContentType;
        $objFile->size = strlen(base64_decode($arrData[1]));
        $objFile->error = 0;
        return $objFile;
    }

}