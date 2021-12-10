<?php

namespace App\Validator;

use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use App\Entity\Track;




class ThumbnailPathValidator extends ConstraintValidator
{
    public function validate($path, Constraint $constraint)
    {
        /* @var $constraint \App\Validator\ThumbnailPath */

        if (null === $path || '' === $path) {
            return;
        }

        if (preg_match(self::thumbnail_url_regex(), $path)) {
            return;
        }

        $this->context->buildViolation($constraint->message)
            ->setParameter('{{ path }}', $path)
            ->addViolation();
    }

    private static function thumbnail_url_regex(){
        return "#^https://i.ytimg.com/vi/" . Track::$track_id_regex . "/mqdefault.jpg$#";
    }
}
