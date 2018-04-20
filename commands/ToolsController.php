<?php
/**
 * Created by PhpStorm.
 * User: roma
 * Date: 10.04.18
 * Time: 13:19
 */

namespace app\commands;


use app\models\HashUrl;
use yii\console\Controller;

class ToolsController extends Controller
{
    public function actionRandHash()
    {
        $arr = [];
        $i = 0;
        $collision = 0;
        while ($i < 1000000) {
            while(true) {
                $k = generateRandomString(7);
                if(!isset($arr[$k])) {
                    $arr[$k] = 1;
                    $i++;
                    break;
                }
                $collision++;
            }
        }
        print "collision = $collision\n";
        print "total = ".count($arr) . PHP_EOL;
        foreach ($arr as $strKey => $intVal) {
            $objUrl = new HashUrl();
            $objUrl->hash = 'us-'.$strKey;
            $objUrl->used = 0;
            $objUrl->save();

        }

    }

    public function actionDownloadCovers()
    {
        $strCovers = 'http://mybs.eu/media/wallpapers/intro_paris2.jpg
http://www.astateoftrance.com/wp-content/uploads/wp-post-thumbnail/rGQgQp.jpg
https://www.planeasy.ca/wp-content/uploads/2017/10/Benefits-of-RRSPs-1600x400.jpg
https://i1.wp.com/mainefamilycamping.com/wp-content/uploads/2015/02/team-hidn-pines-cover.jpg?fit=1600%2C400&ssl=1
https://cdn.allsquaregolf.com/pictures/pictures/000/071/532/full/juday_creek_golf_club_cover_picture.jpg
http://www.bonattinternational.com/media/immagini/176_z_project-management1_w_1.jpg
http://nsb.co.za/wp-content/uploads/2012/08/slider111.jpg
http://www.reisereiseband.com/wp-content/uploads/2017/10/cropped-Modave2017-12-1.jpg
http://www.baansanthiya.com/images/cover/cover-05.jpg
http://www.jamessparker.org/wp-content/uploads/2016/03/bookcover-4.jpg
http://www.gracefellowshipaz.org/wp-content/uploads/2015/02/findyourwayhome.jpg
http://aldgatebaptist.org.au/images/cover_default.jpg
https://www.antraweb.com/wp-content/uploads/2015/04/ban41.jpg
http://www.karsoo.com/UserImage/CoverImage/nocoverimage.jpg
https://static.lybrate.com/imgs/product/d2d/assets/profile_default_cover_image.jpg
https://www.navandgen.zurich.co.uk/_/media/dbe/uk-nav-gen/images/components/stageslider/prestige.jpg?w=1600
http://www.proudafricankids.com/wp-content/uploads/2017/10/Africa_History_cover_picture-1600x400.jpg
https://lifeinsurancepost.com/wp-content/uploads/2016/07/life-insurance-after-stroke-image.jpg
http://coverband.coverstudio.pl/wp-content/themes/wallstreet-pro/images/page-header-bg.jpg
https://www.antraweb.com/wp-content/uploads/2015/04/Add-ons.jpg
http://trinitysouthlake.com/wp-content/uploads/2015/01/blue-background.jpg
http://www.feelgoodinc.mx/wp-content/uploads/2014/11/bgft.jpg
http://sippindustries.com/v3-112415/wp-content/uploads/2015/12/Distribution-1600x400.jpg
http://www.kyriba.com/sites/default/files/images/rd/backgrounds/why-kyriba.jpg
http://yufengconsulting.de/wp-content/uploads/2018/01/cropped-background-Kopie.jpg
https://s3-us-west-1.amazonaws.com/foothills-wp-content/wp-content/uploads/2018/02/11172651/seeing_things_as_the_are_background.jpg
https://kyrikos.gr/wp-content/uploads/2016/11/cropped-beauty-jewelry-desktop-background-hd-wallpapers.jpg
http://ninelives.tattoo/wp-content/uploads/2016/07/Rock-Out-with-Your-Locks-Out-Background-1.jpg
https://www.omegawatches.com/media/catalog/category/SE-Diver300M-GentsCollection-imgTetiere-large.jpg
https://www.ou.nl/documents/40554/43113/OW_HTMLscherm_head_small.jpg';
        $arrCovers = preg_split('/[\n\r]+/', $strCovers);
        foreach ($arrCovers as $tmpIndex => $strCover) {
            print "$strCover ..." .PHP_EOL;
            file_put_contents(\Yii::getAlias('@app/web/covers/'.($tmpIndex+1).'.jpg'), file_get_contents($strCover));
        }
    }

}

function generateRandomString($length = 32)
{
    $bytes = \Yii::$app->security->generateRandomKey($length);
    // '=' character(s) returned by base64_encode() are always discarded because
    // they are guaranteed to be after position $length in the base64_encode() output.
    return strtolower(strtr(substr(base64_encode($bytes), 0, $length), '+/', 'AB'));
}


