# Як долучитися / Contributing

Повний порядок супроводу: [docs/BLUEPRINT.uk.md](docs/BLUEPRINT.uk.md), розділ 4.
Full procedure: [docs/BLUEPRINT.md](docs/BLUEPRINT.md), section 4.

## Коротко / In short

1. Одна зміна - один pull request: новий акт, зміна статусу, нові положення або зіставлення.
   One change per pull request: a new act, a status change, new provisions or mappings.
2. **Зіставлення** редагуйте в Excel у `mappings/*.xlsx`: аркуш «Вимоги» і аркуш стандарту (`iso27001-2022`, `csf-2.0`). Підказки - у примітках до заголовків.
   Edit **mappings** in Excel in `mappings/*.xlsx`: the «Вимоги» sheet and the framework sheet. The header notes explain each column.
3. **Решту даних** редагуйте в CSV у `data/` (UTF-8 без BOM; в Excel - лише через імпорт з UTF-8). Ідентифікатори і `eli` постійні. Новий акт отримує наступний вільний `register_no`; акти ЄС - `scope=reference`; зв'язки в `source_relations.csv` - властивості ELI (`based_on`, `amends`, `repeals`, `transposes`...).
   Edit **everything else** in the CSV files in `data/` (UTF-8, no BOM). IDs and `eli` are permanent. A new act takes the next free `register_no`; EU acts get `scope=reference`; links in `source_relations.csv` are ELI properties.
4. Нове зіставлення має статус «чернетка», згенероване ШІ - «ШІ (не вичитано)». «Перевірено» ставить друга людина і вписує себе в «Хто перевірив».
   New mappings are drafts, AI-generated ones «ШІ (не вичитано)». A second person sets «перевірено» and fills in «Хто перевірив».
5. Не вставляйте текст ISO: лише ідентифікатори та власні формулювання.
   Do not paste ISO text: identifiers and your own wording only.

Перевірка запускається автоматично; локально / The check runs automatically; locally:

```
pip install openpyxl
python3 scripts/validate.py --stats
python3 scripts/build.py && python3 -m http.server 8000 -d _site   # http://localhost:8000
```

Є шаблони issue для нового чи зміненого акта та для помилки в зіставленні.
There are issue templates for a new or changed act and for a wrong mapping.
