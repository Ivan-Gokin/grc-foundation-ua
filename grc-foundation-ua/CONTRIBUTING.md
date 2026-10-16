# Як долучитися / Contributing

Повний порядок супроводу: [docs/BLUEPRINT.uk.md](docs/BLUEPRINT.uk.md), розділ 4.
Full procedure: [docs/BLUEPRINT.md](docs/BLUEPRINT.md), section 4.

## Коротко / In short

1. Одна зміна - один pull request: новий акт, зміна статусу, нові положення або зіставлення.
   One change per pull request: a new act, a status change, new provisions or mappings.
2. Редагуйте CSV у `data/` (UTF-8 без BOM). Ідентифікатори постійні: не перейменовуйте опубліковані.
   Edit the CSV files in `data/` (UTF-8, no BOM). IDs are permanent: never rename published ones.
   Новий акт отримує наступний вільний `register_no`; номери не використовуються повторно. Акти ЄС - `scope=reference`.
   A new act takes the next free `register_no`; numbers are never reused. EU acts get `scope=reference`.
   Кожен акт має `eli` (офіційний ELI для актів ЄС, інакше шлях проєкту `eli/ua/...`), а зв'язки в `source_relations.csv` - властивості ELI (`based_on`, `amends`, `repeals`, `transposes`...). Після змін запустіть `python3 scripts/build_eli.py`.
   Every act has an `eli` (the official ELI for EU acts, otherwise the project path `eli/ua/...`), and links in `source_relations.csv` are ELI properties (`based_on`, `amends`, `repeals`, `transposes`...). After changes, run `python3 scripts/build_eli.py`.
3. Запустіть перевірку / Run the check:

   ```
   python3 scripts/validate.py --stats
   ```

4. Нове зіставлення має `review_status=draft`. Статус `reviewed` ставить друга людина, вказавши себе в `reviewed_by`.
   New mappings start as `review_status=draft`. A second person sets `reviewed` and fills in `reviewed_by`.
   Зіставлення, згенеровані ШІ, мають `review_status=ai_draft`, а `mapped_by` починається з "AI". Їх вичитують за текстом акта так само.
   AI-generated mappings get `review_status=ai_draft` and a `mapped_by` starting with "AI". They are reviewed against the text of the act in the same way.
5. Не вставляйте текст ISO: лише ідентифікатори та власні формулювання.
   Do not paste ISO text: identifiers and your own wording only.

Є шаблони issue для нового чи зміненого акта та для помилки в зіставленні.
There are issue templates for a new or changed act and for a wrong mapping.

## Локальний запуск / Run locally

Сайт читає файли з `data/`, тож відкривайте його через вебсервер, а не як файл:
The site reads files from `data/`, so open it through a web server, not as a file:

```
python3 -m http.server 8000
# http://localhost:8000
```
