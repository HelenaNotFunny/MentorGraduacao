from pydantic import BaseModel
from .course import CourseOut
from .subject import SubjectOut


class CourseSubjectCreate(BaseModel):
    course_id: int
    subject_id: int


class CourseSubjectOut(BaseModel):
    id: int
    course_id: CourseOut
    subject_id: SubjectOut

    model_config = {"from_attributes": True}