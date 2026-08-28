import { BooleanField, FormFieldGroup, ImageField, JSONObject, NumberField, ParagraphField, SelectField, StringField } from "@devvit/public-api";

export type TypedFormField<T extends JSONObject> =
    StringField & { name: keyof T }
    | ImageField & { name: keyof T }
    | ParagraphField & { name: keyof T }
    | NumberField & { name: keyof T }
    | BooleanField & { name: keyof T }
    | SelectField & { name: keyof T }
    | FormFieldGroup;
