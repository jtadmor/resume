## $name Resume

*$description*

### Contact
<!-- Would like not to need HTML but sizing for images is not consistent in markdown -->
{#each contacts}
[<img src="$icon" alt="$type" height="16px" width="16px"> $content]($href)
{/each contacts}

### Technologies
{#each technologies}
* $technologies
{/each technologies}

### Work Experience
{#each work-experience}
### $title, *$org*, $dates

{#if responsibilities}
#### Responsibilities
{#each responsibilities}
* $responsibilities
{/each responsibilities}
{/if responsibilities}

{#if key-results}
#### Key Results
{#each key-results}
* $key-results
{/each key-results}
{/if key-results}

{/each work-experience}

## Education
{#each education}
### $degree, *$institution*, $year
{#each notes}
* $notes
{/each notes}
{/each education}
