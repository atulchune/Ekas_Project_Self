import getpass

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from apps.accounts.models import User
from apps.operations.models import Role, StaffProfile, StaffRole


class Command(BaseCommand):
    help = (
        "Creates (or promotes) the first Operations Portal Super Admin. "
        "Since Django Admin is not used for business operations, this is "
        "the only supported way to bootstrap staff access. Runs "
        "non-interactively when --noinput is passed and email/password are "
        "supplied via --email/--password or the OPERATIONS_ADMIN_EMAIL / "
        "OPERATIONS_ADMIN_PASSWORD environment variables."
    )

    def add_arguments(self, parser):
        parser.add_argument("--email", default=None)
        parser.add_argument("--password", default=None)
        parser.add_argument("--noinput", action="store_true", default=False)

    @transaction.atomic
    def handle(self, *args, **options):
        email = (options["email"] or settings.OPERATIONS_ADMIN_EMAIL or "").lower().strip()
        password = options["password"] or settings.OPERATIONS_ADMIN_PASSWORD

        if not email:
            if options["noinput"]:
                raise CommandError("--email or OPERATIONS_ADMIN_EMAIL is required in non-interactive mode.")
            email = input("Super Admin email: ").strip().lower()

        if not password:
            if options["noinput"]:
                raise CommandError("--password or OPERATIONS_ADMIN_PASSWORD is required in non-interactive mode.")
            password = getpass.getpass("Super Admin password: ")
            confirm = getpass.getpass("Confirm password: ")
            if password != confirm:
                raise CommandError("Passwords did not match.")

        if not email or not password:
            raise CommandError("Both an email and a password are required.")

        user, created = User.objects.get_or_create(
            email=email, defaults={"is_staff": True, "is_superuser": True, "email_verified": True}
        )
        user.is_staff = True
        user.is_superuser = True
        user.is_active = True
        user.email_verified = True
        user.set_password(password)
        user.save()

        profile, _ = StaffProfile.objects.get_or_create(user=user)
        profile.is_super_admin = True
        profile.save(update_fields=["is_super_admin"])

        super_admin_role, _ = Role.objects.get_or_create(
            name="Super Admin", defaults={"description": "Complete access to every module.", "is_system": True}
        )
        StaffRole.objects.get_or_create(staff=profile, role=super_admin_role)

        verb = "Created" if created else "Updated"
        self.stdout.write(self.style.SUCCESS(f"{verb} Operations Portal Super Admin for {email}."))
