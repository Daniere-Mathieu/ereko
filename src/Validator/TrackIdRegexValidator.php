<?php

namespace App\Validator;

use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use App\Entity\Track;

class TrackIdRegexValidator extends ConstraintValidator
{
    public function validate($uid, Constraint $constraint)
    {
        /* @var $constraint \App\Validator\TrackIdRegex */

        if (null === $uid || '' === $uid) {
            return;
        }

        if (preg_match(Track::singleTrackIdRegex(), $uid)) {
            return;
        }

        // TODO: implement the validation here
        $this->context->buildViolation($constraint->message)
            ->setParameter('{{ uid }}', $uid)
            ->addViolation();
    }
}
