"""add_created_at_to_user

Revision ID: 8892fe0d06f0
Revises: 24640762d76f
Create Date: 2026-06-01 20:57:00.456563

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision: str = '8892fe0d06f0'
down_revision: Union[str, None] = '24640762d76f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('User', sa.Column('created_at', sa.DateTime(), nullable=False,
                                    server_default=sa.text('CURRENT_TIMESTAMP')))


def downgrade() -> None:
    op.drop_column('User', 'created_at')
