/* List tables
aws dynamodb list-tables --endpoint-url  http://localhost:8000
 */

/* Create tables
aws dynamodb create-table \
  --table-name BondMovies \
  --attribute-definitions \
    AttributeName=Director,AttributeType=S \
    AttributeName=MovieTitle,AttributeType=S \
  --key-schema AttributeName=Director,KeyType=HASH AttributeName=MovieTitle,KeyType=RANGE \
  --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1 \
  --endpoint-url http://localhost:8000
 */

/* Delete tables
aws dynamodb delete-table --table-name BondMovies --endpoint-url http://localhost:8000
*/

/* Put Item
aws dynamodb put-item --table-name BondMovies \
  --endpoint-url http://localhost:8000 \
  --item '{"Director":{"S":"Broccoli"},"MovieTitle":{"S":"Dr. No"},"ReleaseYear":{"S":"2002"}}'
*/

/* Update Item
aws dynamodb update-item --table-name BondMovies \
  --endpoint-url http://localhost:8000 \
  --key '{"Director":{"S":"Broccoli"},"MovieTitle":{"S":"Dr. No"}}' \
  --update-expression "SET ReleaseYear = :releaseyear" \
  --expression-attribute-values '{":releaseyear":{"S":"2009"}}' \
  --return-values ALL_NEW
*/






