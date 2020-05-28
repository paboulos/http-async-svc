# http-crud

**A Node module that is used to easily make asynchronous CRUD network requests with TypesScript or JavaScript.\
The APIs in this module require familiarity with Promises, fetch and HTTP methods.**

-   Defaults to using the node-fetch module when one isn't injected as an argument
-   Entity body in the response is conditional on the presence of 204 status code and content-type header.

## APIs

1. read
2. curriedRead
3. create
4. curriedCreate
5. update
6. curriedUpdate
7. del
8. curriedDel

---

## Usage Examples

**TypeScript**

1. Install runner: npm i -g ts-node
2. Run: ts-node .\demo.ts

**JavaScript**

-   refer to unit tests

## RFC Guidelines for CRUD HTTP Methods

### **Create**

-   `PUT` with a new URI

    -   If a new resource is created, the origin server MUST inform the user agent via the 201 (Created).
    -   A PUT request on a general URI might result in several other URIs being defined by the origin server.
    -   If the resource could not be created or modified with the Request-URI, an appropriate error response SHOULD\
        be expected that reflects the nature of the problem.
    -   A client can make the request conditional by using the `IF-None-Match` header when it believes that\
        the resource does not exist. A special case value "\*" matches any current entity of the resource. If the\
        precondition fails then the server MUST NOT perform the request and send a 412 response.
    -   If the server desires that the request be applied to a different URI, it MUST send a 301 (Moved Permanently)\
        response; the user agent MAY then make its own decision regarding whether or not to redirect the request.
    -   The recipient of the entity MUST NOT ignore any Content-\* (e.g. Content-Range) headers that it does not\
        understand or implement and MUST return a 501 (Not Implemented) response in such cases.
    -   The entity-headers in the PUT request SHOULD be applied to the resource created or modified by the PUT.

    -   If the request passes through a cache and the Request-URI identifies one or more currently cached entities, those\
        entries SHOULD be treated as stale. Responses to this method are not cacheable.

-   `POST` to a base URI
    -   Returns a newly created URI. If a resource has been created response SHOULD be 201.
    -   The action performed by the POST method might not result in a resource that can be identified by a URI. In this case,\
        either 200 (OK) or 204 (No Content) is the appropriate response status, depending on whether or not the response includes\
        an entity that describes the result.
    -   If a resource is created on the origin server the response status is 201. The response should contain an entity describing\
        the status of the request and refers to the new resource in a Location header.
    -   Responses to this method are not cacheable, unless the response includes appropriate Cache-Control or Expires header fields.\
        A 303 status response can be used to direct the user agent to retrieve a cacheable resource.

### **Read**

-   `GET` with an existing URI
    -   The semantics of the GET method change to a `conditional GET` if the request message includes an If-Modified-Since,\
         If-Unmodified-Since, If-Match, If-None-Match, or If-Range header field.
    -   The `conditional GET` method is intended to reduce unnecessary network usage by allowing cached entities to be refreshed\
         without requiring multiple requests or transferring data already held by the client.
    -   If a conditional request has not been modified since the time specified for `If-Modified-Since`, the response code is 304 and\
        no entity will be returned. Clients are advised to use the exact date string received in a previous Last-Modified header\
        whenever possible.
    -   If the requested resource has not been modified since the time specified in the `If-Unmodified-Since` header the server performs\
        the requested operation. If it has been modified the operation is not performed and the 412 (Precondition Failed) is returned.
    -   A conditional request uses the `If-Match` header to check cached entity tags obtained from the resource. When none of the entity\
        tags match the server doesn't perform the request and returns a 412 response.
    -   A client that has cached entities can verify that none of those entities is current by including a list of their associated entity\
        tags in the `If-None-Match` header field. When the precondition fails and the request method is GET the server SHOULD respond with\
        a 304 (Not Modified), including the cache-related header fields (e.g. ETag) of one of the entities that matched.
    -   If a client has a partial copy of an entity in its cache, and wishes to have an up-to-date copy of the entire entity in its\
        cache, it could use a byte range (refer to Entity description).
    -   For cache updates a `conditional GET` with an `If-Range` is usually more efficient. It is used together with the `Range` header.\
        `If-Range` can contain the last modified date or entity-tag.
    -   If the entity tag given in the `If-Range` header matches the current entity tag for the entity the server provides the specified\
        sub-range of the entity using a 206 response. If the tag doesn't match the server returns the entire entity using a 200 code.
    -   The semantics of the GET method change to a `partial GET` if the request message includes a `Range` header field. A partial\
        GET requests that only part of the entity be transferred.
    -   A successful `partial GET` request SHOULD be indicated with a 206 code.
    -   A 206 response must include a Content-Range, Date, and either ETag or Content-Location header.
    -   The presence of a `Range` header in a `conditional GET` modifies what is returned if the GET is otherwise successful and the\
        condition is true. It does not affect the 304 response returned if the condition is false.
    -   The response to a GET request is cacheable if and only if it meets the requirements for HTTP caching

### **Update**

-   `PUT` with an existing URI
    -   If an existing resource is modified, either the 200 (OK) or 204 (No Content) response codes SHOULD be expected to\
        indicate successful completion of the request.
    -   Unless otherwise specified for a particular entity-header, the entity-headers in the PUT request SHOULD be applied\
        to the resource created or modified by the PUT.
    -   Some headers can be applied to this method to make it conditional (e.g. If-Match). (refer to Read description)
    -   If the precondition of a request header fails and the response is 412 the update MUST NOT be applied to the resource.\
        This allows the user to indicate that they only wish the request to be successful if the entity is not stale.

### **Delete**

-   `DELETE` with an existing URI
    -   A successful response SHOULD be 200 (OK) if the response includes an entity describing the status, 202 (Accepted)\
        if the action has not yet been enacted, or 204 (No Content) if the action has been enacted but the response does not\
        include an entity. If the request passes through a cache and the Request-URI identifies one or more currently cached\
        entities, those entries SHOULD be treated as stale. Responses to this method are not cacheable.

---

## Common HTTP Status/Response Codes

**Success 2xx, 3xx**

-   `OK` 200
-   `CREATED` 201
-   `Accepted` 202
-   `No Content` 204
-   `Partial Content` 206
-   `Multiple Choices` 300
-   `Moved Permanently` 301
-   `See Other` 303
-   `Not Modified` 304

**Error 4xx, 5xx**

-   `Bad Request` 400
-   `Unauthorized` 401
-   `Forbidden` 403
-   `Not Found` 404
-   `Method Not Allowed` 405
-   `Not Acceptable` 406
-   `Request Timeout` 408
-   `Gone` 410
-   `Precondition Failed` 412
-   `Internal Error` 500
-   `Not Implemented` 501

---

## Entities

-   An entity is the cargo of the HTTP message.
-   The message entity contains the entity headers and the entity body
-   All HTTP entities are represented in HTTP messages as sequences of bytes and the byte range is meaningful for\
    any HTTP entity.
-   Byte range specifications in HTTP apply to the sequence of bytes in the entity-body (not necessarily the same\
    as the message-body).
-   For any entity range header the first-byte-pos value in a byte-range-spec gives the byte-offset of the first\
    byte in a range. The last-byte-pos value gives the byte-offset of the last byte in the range. Meaning,\
    the byte positions are inclusive and the offsets start at zero.
-   Multiples entities can exist for a particular resource
-   Entity tags are used for comparing two or more entities from the same requested resource.
-   HTTP/1.1 uses entity tags in the ETag, If-Match, If-None-Match, and If-Range header fields.
-   Origin servers and caches will compare two validators to decide if they represent the same or different entities
-   Entity validators can be strong or weak and may not give the same comparision outcome.
-   The content headers provide specific information about the content of the entity, revealing its type, size, and other\
    information useful for processing it.
-   The entity caching headers provide information about the entity being cached

## Entity Headers

**Entities can appear in both request and response messages. There are three types of entity headers that a transaction can use.**

### 1. Entity Informational Headers

|  Header  | Description                                                                                                            |
| :------: | ---------------------------------------------------------------------------------------------------------------------- |
|  Allow   | Lists the request methods that can be performed on this entity.                                                        |
| Location | Tells the client where the entity really is located; used in directing the receiver to a URL location for the resource |

### 2. Content Headers

|      Header      | Description                                                             |
| :--------------: | ----------------------------------------------------------------------- |
|   Content-Base   | The base URL for resolving relative URLs within the body.               |
| Content-Encoding | Any encoding that was performed on the body                             |
| Content-Language | The natural language that is best used to understand the body.          |
|  Content-Length  | The length or size of the body                                          |
| Content-Location | Where the resource is actually located.                                 |
|   Content-MD5    | An MD5 checksum of the body                                             |
|  Content-Range   | The range of bytes that this entity represents from the entire resource |
|   Content-Type   | The type of object that the body contains                               |

### 3. Entity Cache Headers

|    Header     | Description                                                                                                         |
| :-----------: | ------------------------------------------------------------------------------------------------------------------- |
|     ETag      | The entity tag associated with the entity.                                                                          |
|    Expires    | The date and time at which this entity will no longer be valid and will need to be fetched from the original source |
| Last-Modified | The last date and time when this entity changed                                                                     |
