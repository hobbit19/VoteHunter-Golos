<?php
/**
 * Created by PhpStorm.
 * User: roma
 * Date: 02.04.18
 * Time: 17:28
 */

namespace app\helpers;


use yii\web\UploadedFile;

class IPFSHelper
{
    public static function uploadVideo()
    {
        $objVideoFile = UploadedFile::getInstanceByName('video_file');
        if(!is_null($objVideoFile)) {
            //process new cover image
            $arrPost = [
                'file' => new \CURLFile($objVideoFile->tempName, $objVideoFile->type, $objVideoFile->name),
            ];
            $objCurl = curl_init();
            curl_setopt($objCurl, CURLOPT_URL, "http://localhost:5001/api/v0/add");
            curl_setopt($objCurl, CURLOPT_HEADER, false);
            curl_setopt($objCurl, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($objCurl, CURLOPT_POST, true);
            curl_setopt($objCurl, CURLOPT_POSTFIELDS, $arrPost);
            $result = curl_exec($objCurl);
            curl_close($objCurl);
            return json_decode($result, true);
        }
        return false;
    }
}